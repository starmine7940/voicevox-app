import { createUseStyles } from "react-jss"
import { FC } from "react"
import "semantic-ui-css/semantic.min.css"
import { Title } from "./Title"
import { Notion } from "./Notion"
import { Body } from "./Body"

const useStyles = createUseStyles({})

export const Page: FC = () => {
  const classes = useStyles() // eslint-disable-line

  return (
    <>
      <Title />
      <Body />
      <Notion />
    </>
  )
}
