export interface OwnerDto {
  login?: string;
  avatar_url?: string;
  avatarUrl?: string; // accept both variants
}

export interface RepoDto {
  id: number;
  name?: string;
  full_name?: string;
  fullName?: string;
  html_url?: string;
  htmlUrl?: string;
  description?: string;
  owner?: OwnerDto;
}
