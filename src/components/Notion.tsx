import { createUseStyles } from "react-jss"
import { FC } from "react"
import {
  Header,
  Divider,
  Container,
  Accordion,
  List,
  ListItem,
} from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"

const useStyles = createUseStyles({})

const accordionPanels = [
  {
    key: "0",
    title: "詳しい仕様",
    content: {
      content: (
        <>
          <Header>生成される音声データ</Header>
          <List bulleted>
            <ListItem>全て MP3 ファイルです。</ListItem>
            <ListItem>
              ダウンロードされるファイル名は、入力されたテキストの先頭 10
              文字です。
            </ListItem>
          </List>
          <Header>リクエスト</Header>
          <List bulleted>
            <ListItem>
              ずんだもんボイス作成のリクエストは、5 分間再実行されます。
            </ListItem>
            <ListItem>
              全てテキストのずんだもんボイス作成のリクエストが成功したら、作成完了したかを確認するリクエストを実行します。
            </ListItem>
            <ListItem>
              5
              分間経っても全てのテキストのずんだもんボイス作成のリクエストが成功しなかった場合、エラーとなります。
            </ListItem>
            <ListItem>
              ずんだもんボイスの作成が完了したかを確認するリクエストは、5
              分間再実行されます。
            </ListItem>
            <ListItem>
              5 分間経っても作成完了にならなかったテキストは、エラーになります。
            </ListItem>
          </List>
          <Header>エラーになったら</Header>
          <List bulleted>
            <ListItem>テキストの分量が多い場合、減らしてください。</ListItem>
            <ListItem>
              サーバに問題がないか、
              <a
                href="https://voicevox.su-shiki.com/info/"
                target=" blank"
                rel=" noopener"
              >
                WEB版VOICEVOX 死活監視・メンテナンス情報
              </a>
              を確認してください。
            </ListItem>
          </List>
        </>
      ),
    },
  },
  {
    key: "1",
    title: "クレジット",
    content: {
      content: (
        <List bulleted>
          <ListItem>
            <a
              href="https://voicevox.su-shiki.com/su-shikiapis/ttsquest/"
              target=" blank"
              rel=" noopener"
            >
              WEB版VOICEVOX API（低速）
            </a>
          </ListItem>
          <ListItem>
            <a
              href="https://voicevox.hiroshiba.jp/product/zundamon/"
              target=" blank"
              rel=" noopener"
            >
              VOICEVOX: ずんだもん
            </a>
          </ListItem>
        </List>
      ),
    },
  },
]

export const Notion: FC = () => {
  const classes = useStyles()
  return (
    <Container>
      <Divider />
      <Accordion fluid styled panels={accordionPanels} />
    </Container>
  )
}
