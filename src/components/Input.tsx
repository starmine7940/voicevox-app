import { createUseStyles } from "react-jss"
import { FC, ChangeEvent, useState } from "react"
import { Form, TextArea, Button, Container } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import React from "react"

const useStyles = createUseStyles({
  buttonContainer: {
    margin: "1em 0em",
  },
  disabled: {
    cursor: "not-allowed",
  },
})

type InputProps = {
  isFetching: boolean
  inputTexts: string[]
  updateInputTexts: (inputText: string) => void
  onRequest: () => Promise<void>
  clearAllData: () => void
}

export const Input: FC<InputProps> = ({
  isFetching,
  inputTexts,
  updateInputTexts,
  onRequest,
  clearAllData,
}) => {
  const classes = useStyles()

  const [isClickedCreateButton, setIsClickedCreateButton] =
    useState<boolean>(false)

  const handleInputTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateInputTexts(event.target.value)
  }

  const handleCreateButtonClick = async () => {
    setIsClickedCreateButton(true)
    await onRequest()
  }

  const handleClearButtonClick = () => {
    setIsClickedCreateButton(false)
    clearAllData()
  }

  return (
    <Container>
      <Form>
        <TextArea
          className={isClickedCreateButton ? classes.disabled : ""}
          value={inputTexts.join("\n")}
          placeholder="ずんだもんボイスに変換したいテキストを入力してください。改行するごとに別の音声ファイルに分かれます。"
          onChange={handleInputTextChange}
          rows={8}
          disabled={isClickedCreateButton}
        />
      </Form>
      <div className={classes.buttonContainer}>
        <Button
          content="生成"
          onClick={handleCreateButtonClick}
          disabled={
            isFetching || isClickedCreateButton || inputTexts.length === 0
          }
        />
        <Button
          content="クリア"
          onClick={handleClearButtonClick}
          disabled={isFetching || !isClickedCreateButton}
        />
      </div>
    </Container>
  )
}
