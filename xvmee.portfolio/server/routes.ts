import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { existsSync } from "fs";

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === "production";

// Custom types for extended session
interface ExtendedRequest extends Request {
  file?: Express.Multer.File;
  session: session.Session & {
    authenticated?: boolean;
    userId?: number;
  };
}

// Middleware for checking authentication
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const extReq = req as ExtendedRequest;
  if (extReq.session && extReq.session.authenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

// Configure multer for file uploads - only in development
let upload: multer.Multer;

if (!isProduction) {
  // In development, use disk storage
  const uploadsDir = path.join(process.cwd(), "uploads");

  // Create uploads directory if it doesn't exist
  const ensureUploadsDir = async () => {
    try {
      if (!existsSync(uploadsDir)) {
        await fs.mkdir(uploadsDir, { recursive: true });
      }
    } catch (error) {
      console.error("Error creating uploads directory:", error);
    }
  };

  ensureUploadsDir();

  const storage_config = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });

  upload = multer({ 
    storage: storage_config,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
  });
} else {
  // In production, use memory storage
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      });

      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const extReq = req as ExtendedRequest;
      extReq.session.authenticated = true;
      extReq.session.userId = user.id;
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(400).json({ success: false, message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ success: true });
    });
  });

  app.get("/api/auth/check", (req, res) => {
    const extReq = req as ExtendedRequest;
    return res.status(200).json({ authenticated: !!extReq.session.authenticated });
  });

  // Portfolio routes
  app.get("/api/portfolio", async (_req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      return res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const item = await storage.getPortfolioItem(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      return res.status(200).json(item);
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      return res.status(500).json({ message: "Failed to fetch portfolio item" });
    }
  });

  app.post("/api/portfolio", isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      const extReq = req as ExtendedRequest;
      let imageUrl = "";

      if (isProduction) {
        // In production, use demo images instead of file uploads
        const demoImageId = Math.floor(Math.random() * 2) + 1;
        imageUrl = `/uploads/demo-image-${demoImageId}.jpg`;
      } else {
        // In development, use actual file uploads
        if (!extReq.file) {
          return res.status(400).json({ message: "No image provided" });
        }
        imageUrl = `/uploads/${path.basename(extReq.file.path)}`;
      }

      const portfolioSchema = z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(255),
      });

      const { title, description } = portfolioSchema.parse(req.body);

      const newItem = await storage.createPortfolioItem({
        title,
        description,
        imageUrl,
      });

      return res.status(201).json(newItem);
    } catch (error) {
      // If there's an error and not in production, clean up the uploaded file
      if (!isProduction) {
        const extReq = req as ExtendedRequest;
        if (extReq.file) {
          await fs.unlink(extReq.file.path).catch(console.error);
        }
      }
      
      console.error('Error creating portfolio item:', error);
      return res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create portfolio item" });
    }
  });

  app.delete("/api/portfolio/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const item = await storage.getPortfolioItem(id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Delete the image file in development mode
      if (!isProduction && item.imageUrl.startsWith('/uploads/')) {
        try {
          const filePath = path.join(process.cwd(), item.imageUrl);
          await fs.access(filePath);
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
          // Continue even if file deletion fails
        }
      }

      const success = await storage.deletePortfolioItem(id);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete item" });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  // Serve uploaded files in development mode
  if (!isProduction) {
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  }

  // In production, handle serving the demo image files
  app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    if (filename.startsWith('demo-image-')) {
      // Serve from assets directory in production
      res.sendFile(path.join(process.cwd(), 'client', 'src', 'assets', filename));
    } else {
      // For regular uploads in development
      res.sendFile(path.join(process.cwd(), 'uploads', filename));
    }
  });

  // Create HTTP server, but don't listen yet (it's done in server/index.ts)
  const httpServer = createServer(app);
  return httpServer;
}
