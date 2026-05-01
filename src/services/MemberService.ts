import { Member } from "../models/Member";
import { MemberRepository } from "../repositories/MemberRepository";

export class MemberService {
    constructor(private memberRepo: MemberRepository) {}

    // REGISTER MEMBER
    async registerMember(
        memberData: Omit<Member, "id" | "joinedAt" | "isActive">
    ): Promise<Member> {
        if (!memberData.name?.trim()) throw new Error("Member name is required");
        if (!memberData.email?.trim()) throw new Error("Member email is required");

        const emailExists = (await this.memberRepo.getAll()).some(
            (m) => m.email === memberData.email
        );

        if (emailExists) {
            throw new Error("Email already exists");
        }

        const newMember: Member = {
            id: Date.now(),
            ...memberData,
            isActive: true,
            joinedAt: new Date(),
        };

        return this.memberRepo.add(newMember);
    }

    // GET ALL MEMBERS
    async getAllMembers(): Promise<Member[]> {
        return this.memberRepo.getAll();
    }

    // GET MEMBER BY ID
    async getMemberById(id: number): Promise<Member> {
        const member = await this.memberRepo.getById(id);
        if (!member) throw new Error("Member not found");
        return member;
    }

    // REMOVE MEMBER
    async removeMember(id: number): Promise<void> {
        await this.getMemberById(id);
        await this.memberRepo.remove(id);
    }

    // UPDATE MEMBER
    async updateMember(
        id: number,
        updates: Partial<Omit<Member, "id" | "joinedAt">>
    ): Promise<Member> {
        await this.getMemberById(id);
        return this.memberRepo.update(id, updates);
    }

    // SEARCH BY NAME
    async searchByName(name: string): Promise<Member[]> {
        if (!name.trim()) throw new Error("Search name required");
        return this.memberRepo.findByName(name);
    }

    // SEARCH BY EMAIL
    async searchByEmail(email: string): Promise<Member[]> {
        if (!email.trim()) throw new Error("Search email required");
        return this.memberRepo.findByEmail(email);
    }

    // DEACTIVATE MEMBER
    async deactivateMember(id: number): Promise<Member> {
        await this.getMemberById(id);

        return this.memberRepo.update(id, {
            isActive: false,
        });
    }

    // ACTIVATE MEMBER
    async activateMember(id: number): Promise<Member> {
        await this.getMemberById(id);

        return this.memberRepo.update(id, {
            isActive: true,
        });
    }
}