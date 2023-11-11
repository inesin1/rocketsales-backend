export interface Auth {
  token_type: string,
  expires: number,
  access_token: string,
  refresh_token: string,
}