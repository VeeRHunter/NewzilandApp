import { BranchModel } from './branchModel';

export class AgentModel {
    public agentId: number;
    public agentCode: string;
    public agentName: string;
    public branchId: number;
    public branchCode: string;
    public branchName: string;
    public userId: number;
    public emailAddress: string;
    public tel_cell: string;
    public isActive: boolean;
    public isBudgetOnlyAgent: boolean;
    public sellingBranches: BranchModel[];
}