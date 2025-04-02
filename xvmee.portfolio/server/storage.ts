import { User, InsertUser, PortfolioItem, InsertPortfolioItem } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// Initial data for demo purposes
const initialPortfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Discord Bot Example",
    description: "A custom bot for Discord server management",
    imageUrl: "/uploads/demo-image-1.jpg"
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Discord-inspired personal portfolio site",
    imageUrl: "/uploads/demo-image-2.jpg"
  }
];

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Portfolio management
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  deletePortfolioItem(id: number): Promise<boolean>;
  
  // Persistence methods
  saveToFile(): Promise<void>;
  loadFromFile(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private portfolioItems: Map<number, PortfolioItem>;
  private userId: number;
  private portfolioId: number;
  private dataFilePath: string;

  constructor() {
    this.users = new Map();
    this.portfolioItems = new Map();
    this.userId = 1;
    this.portfolioId = 1;
    this.dataFilePath = path.join(process.cwd(), 'data', 'portfolio-data.json');
    
    // Create default admin user
    this.createUser({
      username: "xvmee",
      password: "Balkazejowy1234" // In production, this should be hashed
    });
    
    // Initialize
    if (isProduction) {
      // In production (Vercel), load demo data
      console.log('Running in production mode, using demo data');
      this.initDemoData();
    } else {
      // In development, load data from file
      console.log('Running in development mode, loading from file');
      this.loadFromFile().catch(error => {
        console.error('Failed to load data from file:', error);
      });
    }
  }

  // Initialize with demo data for production environment
  private initDemoData() {
    this.portfolioId = initialPortfolioItems.length + 1;
    initialPortfolioItems.forEach(item => {
      this.portfolioItems.set(item.id, item);
    });
    console.log(`Initialized with ${this.portfolioItems.size} demo portfolio items`);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Portfolio methods
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolioItems.values());
  }

  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    return this.portfolioItems.get(id);
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const id = this.portfolioId++;
    const item: PortfolioItem = { ...insertItem, id };
    this.portfolioItems.set(id, item);
    
    // Save to file in development mode
    if (!isProduction) {
      await this.saveToFile();
    }
    
    return item;
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    const deleted = this.portfolioItems.delete(id);
    
    // Save to file in development mode
    if (!isProduction && deleted) {
      await this.saveToFile();
    }
    
    return deleted;
  }
  
  // Persistence methods - only used in development
  async saveToFile(): Promise<void> {
    // Skip file operations in production (Vercel)
    if (isProduction) return;
    
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(path.dirname(this.dataFilePath), { recursive: true });
      
      const data = {
        portfolioItems: Array.from(this.portfolioItems.values()),
        nextPortfolioId: this.portfolioId
      };
      
      await fs.writeFile(this.dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save data to file:', error);
    }
  }
  
  async loadFromFile(): Promise<void> {
    // Skip file operations in production (Vercel)
    if (isProduction) return;
    
    try {
      // Check if file exists
      await fs.access(this.dataFilePath);
      
      // Read file
      const fileData = await fs.readFile(this.dataFilePath, 'utf-8');
      const data = JSON.parse(fileData);
      
      // Reset collections
      this.portfolioItems = new Map();
      
      // Load portfolio items
      if (data.portfolioItems && Array.isArray(data.portfolioItems)) {
        for (const item of data.portfolioItems) {
          this.portfolioItems.set(item.id, item);
        }
      }
      
      // Set next ID
      if (data.nextPortfolioId) {
        this.portfolioId = data.nextPortfolioId;
      }
      
      console.log(`Loaded ${this.portfolioItems.size} portfolio items from file`);
    } catch (error: any) {
      // File might not exist yet, that's fine
      if (error.code !== 'ENOENT') {
        console.error('Error loading data from file:', error);
      }
    }
  }
}

export const storage = new MemStorage();
