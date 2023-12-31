import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY ?? "",
  organization: process.env.OPENAI_ORGANIZATION ?? "",
});

const openai = new OpenAIApi(configuration);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages } = body;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  return NextResponse.json(response.data.choices[0].message);
}
