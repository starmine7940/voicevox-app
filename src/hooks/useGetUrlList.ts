import {
  UseQueryResult,
  useQuery,
} from "@tanstack/react-query"
import {
  GetUrlListFailureResult,
  GetUrlListSuccessResult,
} from "../domain/type"

export type UseGetUrlList = Omit<UseQueryResult, "data"> & {
  urlList: GetUrlListSuccessResult[] | undefined,
}

const pollGetUrlList = async (inputTexts: string[]): Promise<GetUrlListSuccessResult[] | undefined> => {
  const timeout = 300000
  const startTime = Date.now()
  const textsNum = inputTexts.length
  const getVoiceResults = [...Array(textsNum)]
  while (Date.now() - startTime < timeout) {
    for (let i = 0; i < textsNum; i++) {
      if (getVoiceResults[i] !== undefined) continue
      const res = await fetch(
        `https://api.tts.quest/v3/voicevox/synthesis?text=${inputTexts[i]}&speaker=3`, //ずんだもん（ノーマル）
      )
      if (res.ok) {
        const voiceSuccessResult = await res.json() as GetUrlListSuccessResult
        getVoiceResults[i] = voiceSuccessResult
        await new Promise((resolve) => setTimeout(resolve, 5000)) // 成功したら 5 秒空けて次のリクエスト
      } else {
        getVoiceResults[i] = undefined
        const getVoiceFailureResult = (await res.json()) as GetUrlListFailureResult
        console.error("get url failed:", getVoiceFailureResult)
        await new Promise((resolve) => setTimeout(resolve, getVoiceFailureResult.retryAfter * 1000))  // 失敗したら retryAfter だけ空けて次のリクエスト
      }
    }
    if (getVoiceResults.some((getVoiceResult) => getVoiceResult === undefined) === false) {
      return getVoiceResults
    }
  }
  return undefined
}

export const useGetUrlList = (inputTexts: string[]): UseGetUrlList => {
  const result = useQuery({
    queryKey: ["useGetUrlList"],
    queryFn: async () => {
      return pollGetUrlList(inputTexts)
    },
    enabled: false,
    retry: false,
  })
  return {
    ...result,
    urlList: result.data,
  }
}