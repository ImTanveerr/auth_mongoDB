import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
             httpOnly: true,
            secure: true,
            sameSite: "none"
        })
    }
}

export const clearAuthCookie = (res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,       // required on HTTPS (Vercel)
    sameSite: "none" as const,
    maxAge: 0,
  };

  res.cookie("accessToken", "", cookieOptions);
  res.cookie("refreshToken", "", cookieOptions);
};

