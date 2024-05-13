import { createUseStyles } from "react-jss"
import { FC } from "react"
import { Message, MessageContent, MessageHeader } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import React from "react"

const useStyles = createUseStyles({})

export const ErrorMessage: FC = () => {
  const classes = useStyles() // eslint-disable-line

  return (
    <Message negative>
      <MessageHeader>エラー</MessageHeader>
      <MessageContent>データの取得に失敗しました。</MessageContent>
    </Message>
  )
}
