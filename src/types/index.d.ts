import 'dayjs'

declare module 'dayjs' {
  interface Dayjs {
    fromNow()
  }
}
