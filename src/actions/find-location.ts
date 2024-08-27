"use server";

const FindLocation = (request: NextRequest) => {
  const { nextUrl: url } = request;
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'ko';
  console.log("locale", locale)

  return locale;
}

export default FindLocation