import { createUseStyles } from "react-jss"
import { FC, ChangeEvent, useState } from "react"
import { Form, TextArea, Button, Container } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import React from "react"

const useStyles = createUseStyles({
  buttonContainer: {
    margin: "1em 0em",
  },
})

type InputProps = {
  isFetching: boolean
  inputTexts: string[]
  updateInputTexts: (inputTexts: string) => void
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

  const [canEditTextArea, setCanEditTextArea] = useState<boolean>(true)

  const handleInputTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateInputTexts(event.target.value)
  }

  const handleCreateButtonClick = async () => {
    setCanEditTextArea(false)
    await onRequest()
  }

  const handleClearButtonClick = () => {
    setCanEditTextArea(true)
    clearAllData()
  }

  return (
    <Container>
      <Form>
        <TextArea
          value={inputTexts.join("\n")}
          placeholder="ずんだもんボイスに変換したいテキストを入力してください。改行するごとに別の音声ファイルに分かれます。"
          onChange={handleInputTextChange}
          rows={8}
          disabled={!canEditTextArea}
        />
      </Form>
      <div className={classes.buttonContainer}>
        <Button
          content="生成"
          onClick={handleCreateButtonClick}
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
