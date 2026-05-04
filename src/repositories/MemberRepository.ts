import { Member } from "../models/Member";

export class MemberRepository {
    private members: Member[] = [];
    private nextId = 1;

    // ADD MEMBER
    public async add(partial: Omit<Member, "id" | "joinedAt">): Promise<Member> {
        const now = new Date();

        const member: Member = {
            ...partial,
            id: this.nextId++,
            joinedAt: now,
        };

        this.members.push(member);
        return member;
    }

    // UPDATE MEMBER
    public async update(
        id: number,
        patch: Partial<Omit<Member, "id" | "joinedAt">>
    ): Promise<Member> {
        const idx = this.members.findIndex((m) => m.id === id);
        if (idx === -1) {
            throw new Error(`Member not found: ${id}`);
        }

        const updated: Member = {
            ...this.members[idx],
            ...patch,
            id: this.members[idx].id,
            joinedAt: this.members[idx].joinedAt, // Preserve original joined date
        };

        this.members[idx] = updated;
        return updated;
    }

    // REMOVE MEMBER
    public async remove(id: number): Promise<void> {
        const idx = this.members.findIndex((m) => m.id === id);
        if (idx === -1) return;
        this.members.splice(idx, 1);
    }

    // GET BY ID
    public async getById(id: number): Promise<Member | undefined> {
        return this.members.find((m) => m.id === id);
    }

    // GET ALL MEMBERS
    public async getAll(): Promise<Member[]> {
        return [...this.members];
    }

    // FIND BY NAME (search)
    public async findByName(query: string): Promise<Member[]> {
        const q = query.trim().toLowerCase();
        return this.members.filter((m) => m.name.toLowerCase().includes(q));
    }

    // FIND BY EMAIL (search)
    public async findByEmail(query: string): Promise<Member[]> {
        const q = query.trim().toLowerCase();
        return this.members.filter((m) => m.email.toLowerCase().includes(q));
    }

    // DEACTIVATE MEMBER (set isActive to false)
    public async deactivate(id: number): Promise<Member> {
        const idx = this.members.findIndex((m) => m.id === id);
        if (idx === -1) {
            throw new Error(`Member not found: ${id}`);
        }
        
        const updated: Member = {
            ...this.members[idx],
            isActive: false
        };
        
        this.members[idx] = updated;
        console.log(`🔴 Member deactivated: ${updated.name}`);
        return updated;
    }

    // ACTIVATE MEMBER (set isActive to true)
    public async activate(id: number): Promise<Member> {
        const idx = this.members.findIndex((m) => m.id === id);
        if (idx === -1) {
            throw new Error(`Member not found: ${id}`);
        }
        
        const updated: Member = {
            ...this.members[idx],
            isActive: true
        };
        
        this.members[idx] = updated;
        console.log(`🟢 Member activated: ${updated.name}`);
        return updated;
    }

    // GET ACTIVE MEMBERS ONLY
    public async getActiveMembers(): Promise<Member[]> {
        return this.members.filter((m) => m.isActive === true);
    }

    // GET INACTIVE MEMBERS ONLY
    public async getInactiveMembers(): Promise<Member[]> {
        return this.members.filter((m) => m.isActive === false);
    }

    // CHECK IF MEMBER EXISTS
    public async exists(id: number): Promise<boolean> {
        return this.members.some((m) => m.id === id);
    }

    // GET TOTAL COUNT
    public async count(): Promise<number> {
        return this.members.length;
    }

    // SAVE TO JSON FILE
    public async saveToFile(): Promise<void> {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '../data/members.json');
        await fs.writeFile(filePath, JSON.stringify(this.members, null, 2));
        console.log(`💾 Saved ${this.members.length} members to members.json`);
    }

    // LOAD FROM JSON FILE
    public async loadFromFile(): Promise<void> {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '../data/members.json');
        
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const loaded = JSON.parse(data);
            this.members = loaded;
            this.members.forEach(member => {
                member.joinedAt = new Date(member.joinedAt);
                if (member.id >= this.nextId) {
                    this.nextId = member.id + 1;
                }
            });
            console.log(`📂 Loaded ${this.members.length} members from members.json`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log('📄 No members file found, starting fresh');
            } else {
                console.log('⚠️ Error loading members:', error.message);
            }
        }
    }

    // CLEAR ALL MEMBERS (for testing)
    public async clear(): Promise<void> {
        this.members = [];
        this.nextId = 1;
        console.log(`🗑️ All members cleared`);
    }
}