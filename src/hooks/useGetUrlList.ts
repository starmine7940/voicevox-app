import { UseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  GetUrlListFailureResult,
  GetUrlListSuccessResult,
} from "../domain/type"
import { useEffect } from "react"

export type UseGetUrlList = Omit<UseQueryResult, "data"> & {
  urlList: GetUrlListSuccessResult[] | undefined
  clearUseGetUrlList: () => void
}

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

const pollGetUrlList = async (
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

export const useGetUrlListQueryKey = ["useGetUrlList"]

export const useGetUrlList = (inputTexts: string[]): UseGetUrlList => {
  const result = useQuery({
    queryKey: useGetUrlListQueryKey,
    queryFn: async () => {
      return pollGetUrlList(inputTexts)
    },
    enabled: false,
    retry: false,
  })

  useEffect(() => {
    if (inputTexts.length !== undefined && inputTexts.length > 0) {
      result.refetch()
    }
  }, [inputTexts]) // eslint-disable-line react-hooks/exhaustive-deps
  
  const queryClient = useQueryClient()
  const clearUseGetUrlList = () => {
    queryClient.removeQueries({queryKey: ["useGetUrlList"]})
  }

  return {
    ...result,
    urlList: result.data,
    clearUseGetUrlList,
  }
}
