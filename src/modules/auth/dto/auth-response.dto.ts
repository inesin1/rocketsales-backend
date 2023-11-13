export interface AuthResponseDto {
  token_type: string,
  created_at: number,
  expires_in: number,
  access_token: string,
  refresh_token: string,
}