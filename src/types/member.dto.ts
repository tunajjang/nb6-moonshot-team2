export interface MemberResponseDto {
  id: number;
  projectId: number;
  userId: number;
  role: 'OWNER' | 'MEMBER';
  memberStatus: 'PENDING' | 'ACCEPTED';
  invitationId: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  };
  invitation: {
    id: string;
    invitationStatus: 'PENDING' | 'ACCEPTED' | 'CANCELED';
    createdAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface InvitationResponseDto {
  id: string;
  projectId: number;
  hostId: number;
  guestId: number;
  invitationStatus: 'PENDING' | 'ACCEPTED' | 'CANCELED';
  host: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  };
  guest: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  };
  project: {
    id: number;
    name: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvitationDto {
  email: string;
}

export interface UpdateMemberRoleDto {
  role: 'OWNER' | 'MEMBER';
}

export interface UpdateMemberStatusDto {
  memberStatus: 'PENDING' | 'ACCEPTED';
}
