const LocalePageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex w-full min-h-screen bg-neutral-800 items-center justify-center">
      {children}
    </div>
  )
}

export default LocalePageLayout;