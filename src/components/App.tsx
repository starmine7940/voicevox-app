import { FC } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Page } from "./Page"
import React from "react"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const App: FC = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
