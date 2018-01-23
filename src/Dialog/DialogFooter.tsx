import * as React from 'react'

export default ({ children, ...other }: any) => (
  <div className="Sui_Dialog-footer" {...other}>
    {children}
  </div>
)
