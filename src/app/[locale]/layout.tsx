const LocalePageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex w-full min-h-screen bg-slate-800">
      {children}
    </div>
  )
}

export default LocalePageLayout;