import { UseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  GetStatusListSuccessResult,
  GetStatusListFailureResult,
} from "../domain/type"
import { useEffect } from "react"

type GetStatus = {
  isAudioReadyList: boolean[] | undefined
  clearUseGetStatusList: () => void
}

export type UseGetStatusList = Omit<UseQueryResult, "data"> & GetStatus

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec))

const pollGetStatusList = async (
  audioStatusUrlList: string[],
): Promise<boolean[]> => {
  const timeout = 5 * 60 * 1000 // 5minutes
  const startTime = Date.now()
  const urlsNum = audioStatusUrlList.length
  const isAudioReadyList = [...Array(urlsNum)].map(() => false)
  while (Date.now() - startTime < timeout) {
    for (let i = 0; i < urlsNum; i++) {
      if (isAudioReadyList[i] === true) continue
      const res = await fetch(audioStatusUrlList[i] as string)
      if (res.ok) {
        const getStatusSuccessResult =
          (await res.json()) as GetStatusListSuccessResult
        if (getStatusSuccessResult.isAudioReady === true) {
          isAudioReadyList[i] = true
        }
        await sleep(5000) // 成功したら 5 秒空けて次のリクエスト
      } else {
        const getStatusFailureResult =
          (await res.json()) as GetStatusListFailureResult
        console.error("get status failed:", getStatusFailureResult)
        await sleep(getStatusFailureResult.retryAfter * 1000) // 失敗したら retryAfter だけ空けて次のリクエスト
      }
    }
    if (
      isAudioReadyList.some((isAudioReady) => isAudioReady === false) === false
    )
      break
  }
  return isAudioReadyList
}

export const useGetStatusListQueryKey = ["useGetStatusList"]

export const useGetStatusList = (
  audioStatusUrlList: string[] | undefined,
): UseGetStatusList => {
  const result = useQuery({
    queryKey: useGetStatusListQueryKey,
    queryFn: async () => {
      if (audioStatusUrlList === undefined) {
        return undefined
      }
      return pollGetStatusList(audioStatusUrlList)
    },
    enabled: false,
    retry: false,
  })

  // 全てのテキストの URL を取得できたら status を確認する
  useEffect(() => {
    if (audioStatusUrlList && audioStatusUrlList.length > 0) {
      result.refetch()
    }
  }, [audioStatusUrlList]) // eslint-disable-line react-hooks/exhaustive-deps

  const queryClient = useQueryClient()
  const clearUseGetStatusList = () => {
    queryClient.removeQueries({ queryKey: ["useGetStatusList"] })
  }

  return {
    ...result,
    isAudioReadyList: result.data,
    clearUseGetStatusList,
  }
}
