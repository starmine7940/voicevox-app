import { createUseStyles } from "react-jss"
import { FC } from "react"
import { Header } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"

const useStyles = createUseStyles({
  header: {
    backgroundColor: "#B9D08B !important",
    color: "white !important",
    padding: "20px 0 !important",
    textAlign: "center",
  },
})

export const Title: FC = () => {
  const classes = useStyles()

  return (
    <Header as="h1" className={classes.header}>
      ずんだもんボイス生成アプリ
    </Header>
  )
}
