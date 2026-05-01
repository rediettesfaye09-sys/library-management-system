import { Member } from "../models/Member";

type MemberCreate = {
  name: string;
  email: string;
  isActive: boolean;
};

export class MemberRepository {
  private members: Member[] = [];
  private nextId = 1;

  public async add(input: MemberCreate): Promise<Member> {
    const now = new Date();
    const member: Member = {
      ...input,
      id: this.nextId++,
      joinedAt: now,
    };

    this.members.push(member);
    return member;
  }

  public async update(
    id: number,
    patch: Partial<Omit<Member, "id" | "joinedAt">>
  ): Promise<Member> {
    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error(`Member not found: ${id}`);

    const updated: Member = { ...this.members[idx], ...patch, id };
    this.members[idx] = updated;
    return updated;
  }

  public async remove(id: number): Promise<void> {
    const idx = this.members.findIndex((m) => m.id === id);
    if (idx === -1) return;
    this.members.splice(idx, 1);
  }

  public async getById(id: number): Promise<Member | undefined> {
    return this.members.find((m) => m.id === id);
  }

  public async getAll(): Promise<Member[]> {
    return [...this.members];
  }

  public async findByName(query: string): Promise<Member[]> {
    const q = query.trim().toLowerCase();
    return this.members.filter((m) => m.name.toLowerCase().includes(q));
  }

  public async findByEmail(query: string): Promise<Member[]> {
    const q = query.trim().toLowerCase();
    return this.members.filter((m) => m.email.toLowerCase().includes(q));
  }
}