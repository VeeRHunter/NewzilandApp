import { BranchModel } from './branchModel';
import { AgentModel } from './agentModel';

export class LoginResponseModel {
    public userId: number;
    public sessionId: string;
    public branches: BranchModel[];
    public agents: AgentModel[];
    public defaultBranch: BranchModel;
    public menuItems: number[];
    public isHeadOfficeUser: boolean;
    public isBranchAdministrator: boolean;
    public isExternalUser: boolean;
}