import { createUseStyles } from "react-jss"
import { FC, ChangeEvent, useState } from "react"
import { Header, Form, TextArea, Button, Container } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import React from "react"

const useStyles = createUseStyles({
  buttonContainer: {
    margin: "1em 0em",
  },
})

type InputProps = {
  isFetching: boolean
  updateInputTexts: (inputTexts: string) => void
  onRequest: () => Promise<void>
}

export const Input: FC<InputProps> = ({
  isFetching,
  updateInputTexts,
  onRequest,
}) => {
  const classes = useStyles()

  const [canEditTextArea, setCanEditTextArea] = useState<boolean>(true)

  const handleInputTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateInputTexts(event.target.value)
  }

  const handleSubmitButtonClick = async () => {
    setCanEditTextArea(false)
    await onRequest()
  }

  const handleClearButtonClick = () => {
    setCanEditTextArea(true)
  }

  return (
    <Container>
      <Header>
        ずんだもんボイスに変換したいテキストを入力してください。改行するごとに別の音声ファイルに分かれます。
      </Header>
      <Form>
        <TextArea
          placeholder="テキストを入力してください"
          onChange={handleInputTextChange}
          rows={8}
          disabled={!canEditTextArea}
        />
      </Form>
      <div className={classes.buttonContainer}>
        <Button
          content="決定"
          onClick={handleSubmitButtonClick}
          disabled={isFetching}
        />
        <Button
          content="クリア"
          onClick={handleClearButtonClick}
          disabled={isFetching}
        />
      </div>
    </Container>
  )
}
