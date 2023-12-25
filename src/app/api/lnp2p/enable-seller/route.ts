import { NextResponse } from 'next/server'

// 스트라이크에 등록된 웹훅은 POST 방식으로 호출된다.
export async function POST(request: Request) {
  const result = await handler(request)
  return result
}
export async function GET(request: Request) {
  const result = await handler(request)
  return result
}

async function handler(request: Request) {
  const { searchParams } = new URL(request.url)
  const correlationId = searchParams.get('correlationId')
  const otp = searchParams.get('otp')

  console.log({ correlationId, otp })

  // await executeQuery(async client => {
  //   await client.collection('sellers').updateOne(
  //     { correlationId },
  //     {
  //       $set: {
  //         paidAt: Date.now(),
  //       },
  //     },
  //   )
  // })

  // await pushNoti({ eventName: correlationId, message: { correlationId } })

  return NextResponse.json(
    {
      message: 'ok',
    },
    {
      status: 200,
    },
  )
}
