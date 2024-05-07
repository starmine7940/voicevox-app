import { createUseStyles } from "react-jss"
import { FC } from "react"
import {
  Loader,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Message,
  MessageHeader,
  MessageContent,
  Container,
  Popup,
} from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import { UseVoiceBoxResult } from "../hooks/useVoiceVox"
import React from "react"

const useStyles = createUseStyles({})

type PreviewProps = {
  inputTexts: string[]
  result: UseVoiceBoxResult
  isPending: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
}

export const Preview: FC<PreviewProps> = ({
  inputTexts,
  result,
  isPending,
  isFetching,
  isSuccess,
  isError,
}) => {
  // eslint-disable-next-line
  const classes = useStyles()

  const handleSingleDownloadButtonClick = async (
    downloadUrl: string,
    inputText: string,
  ) => {
    try {
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${inputText.slice(0, 10)}.mp3`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("single download failed:", error)
    }
  }

  return (
    <Container>
      <Table celled textAlign="center">
        <TableHeader>
          <TableRow>
            <TableHeaderCell width={2}>テキスト</TableHeaderCell>
            <TableHeaderCell width={1}>プレビュー</TableHeaderCell>
            <TableHeaderCell width={1}>ダウンロード</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inputTexts.map((inputText, index) => (
            <TableRow key={index}>
              <TableCell textAlign="left">{inputText}</TableCell>
              <TableCell>
                {(() => {
                  if (isError) {
                    return (
                      <Message negative>
                        <MessageHeader>エラー</MessageHeader>
                        <MessageContent>
                          データの取得に失敗しました。
                        </MessageContent>
                      </Message>
                    )
                  }
                  if (isFetching) {
                    return <Loader active inline="centered" size="small" />
                  }
                  if (isPending || result?.length === 0) {
                    return null
                  }
                  if (isSuccess && result !== undefined) {
                    if (
                      result[index]?.requestSuccess &&
                      result[index]?.audioGenerateSuccess
                    ) {
                      return (
                        <audio controls src={result[index]?.mp3StreamingUrl} />
                      )
                    }
                    return (
                      <Message negative>
                        <MessageHeader>エラー</MessageHeader>
                        <MessageContent>
                          データの取得に失敗しました。
                        </MessageContent>
                      </Message>
                    )
                  }
                })()}
              </TableCell>
              <TableCell>
                {(() => {
                  if (isError) {
                    return (
                      <Message negative>
                        <MessageHeader>エラー</MessageHeader>
                        <MessageContent>
                          データの取得に失敗しました。
                        </MessageContent>
                      </Message>
                    )
                  }
                  if (isFetching) {
                    return <Loader active inline="centered" size="small" />
                  }
                  if (isPending || result?.length === 0) {
                    return null
                  }
                  if (isSuccess && result !== undefined) {
                    if (
                      result[index]?.audioGenerateSuccess &&
                      result[index]?.mp3DownloadUrl !== undefined
                    ) {
                      return (
                        <Button
                          onClick={() =>
                            handleSingleDownloadButtonClick(
                              result[index]?.mp3DownloadUrl ?? "",
                              inputText,
                            )
                          }
                        >
                          ダウンロード
                        </Button>
                      )
                    }
                    return (
                      <Message negative>
                        <MessageHeader>エラー</MessageHeader>
                        <MessageContent>
                          データの取得に失敗しました。
                        </MessageContent>
                      </Message>
                    )
                  }
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Popup
        content="今後実装予定です。"
        trigger={<Button content="全てをダウンロード" />}
      />
    </Container>
  )
}
