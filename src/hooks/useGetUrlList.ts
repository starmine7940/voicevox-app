import { UseQueryResult, useQuery } from "@tanstack/react-query"
import {
  GetUrlListFailureResult,
  GetUrlListSuccessResult,
} from "../domain/type"

export type UseGetUrlList = Omit<UseQueryResult, "data"> & {
  urlList: GetUrlListSuccessResult[] | undefined
}

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

const pollGetUrlList = async (
  // TODO: ロジックがあっているか確認
  inputTexts: string[],
): Promise<GetUrlListSuccessResult[] | undefined> => {
  const timeoutMs = 5 * 60 * 1000 // 5minutes
  const startTime = Date.now()
  const textsNum = inputTexts.length
  const getVoiceResults: (GetUrlListSuccessResult | undefined)[] = [
    ...Array(textsNum),
  ].map(() => undefined)
  while (Date.now() - startTime < timeoutMs) {
    for (let i = 0; i < textsNum; i++) {
      if (getVoiceResults[i] !== undefined) continue
      const res = await fetch(
        `https://api.tts.quest/v3/voicevox/synthesis?text=${inputTexts[i]}&speaker=3`, //ずんだもん（ノーマル）
      )
      if (res.ok) {
        const voiceSuccessResult = (await res.json()) as GetUrlListSuccessResult
        getVoiceResults[i] = voiceSuccessResult
        await sleep(5000) // 成功したら 5 秒空けて次のリクエスト
      } else {
        getVoiceResults[i] = undefined
        const getVoiceFailureResult =
          (await res.json()) as GetUrlListFailureResult
        console.error("get url failed:", getVoiceFailureResult)
        // 失敗したら retryAfter だけ空けて次のリクエスト
        await sleep(getVoiceFailureResult.retryAfter * 1000)
      }
    }
    // 全部揃ったら返す
    if (getVoiceResults.every((result) => result !== undefined)) {
      return getVoiceResults as GetUrlListSuccessResult[]
    }
  }
  return undefined
}

export const useGetUrlList = (): UseGetUrlList => {
  const result = useQuery<>({
    queryKey: ["useGetUrlList"],
    queryFn: async (inputTexts: string[]) => {
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
