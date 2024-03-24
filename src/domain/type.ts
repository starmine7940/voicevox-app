export type GetUrlListSuccessResult = {
  success: boolean,
  isApiKeyValid: boolean,
  speakerName: string,
  audioStatusUrl: string,
  wavDownloadUrl: string,
  mp3DownloadUrl: string,
  mp3StreamingUrl: string,
}

export type GetUrlListFailureResult = {
  success: boolean,
  isApiKeyValid: boolean,
  errorMessage: number,
  retryAfter: number,
}

export type GetStatusListSuccessResult = {
  success: boolean,
  isAudioReady: boolean,
  isAudioError: boolean,
  status: string,
  speaker: number,
  audioCount: number,
  updatedTime: number,
}

export type GetStatusListFailureResult = {
  success: boolean,
  isApiKeyValid: boolean,
  errorMessage: number,
  retryAfter: number,
}