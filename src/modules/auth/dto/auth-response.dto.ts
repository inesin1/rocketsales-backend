export interface AuthResponseDto {
  token_type: string,
  expire_in: number,
  access_token: string,
  refresh_token: string,
}