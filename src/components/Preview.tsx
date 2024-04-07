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
import { GetUrlListSuccessResult } from "../domain/type"

const useStyles = createUseStyles({})

type PreviewProps = {
  inputTexts: string[]
  urlList: GetUrlListSuccessResult[] | undefined
  isAudioReadyList: boolean[] | undefined
  isPending: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
}

export const Preview: FC<PreviewProps> = ({
  inputTexts,
  urlList,
  isAudioReadyList,
  isPending,
  isFetching,
  isSuccess,
  isError,
}) => {
  const classes = useStyles()

  const handlePreviewButtonClick = (mp3StreamingUrl: string) => {
    window.open(mp3StreamingUrl, "_blank")
  }

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
                  if (isPending) {
                    return null
                  }
                  if (isSuccess && urlList !== undefined) {
                    if (isAudioReadyList && isAudioReadyList[index] === true) {
                      return (
                        <Button
                          onClick={() =>
                            handlePreviewButtonClick(
                              urlList[index].mp3StreamingUrl,
                            )
                          }
                        >
                          プレビュー
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
                  if (isPending) {
                    return null
                  }
                  if (isSuccess && urlList !== undefined) {
                    if (isAudioReadyList && isAudioReadyList[index] === true) {
                      return (
                        <Button
                          onClick={() =>
                            handleSingleDownloadButtonClick(
                              urlList[index].mp3DownloadUrl,
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
