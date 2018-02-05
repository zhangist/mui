// @flow weak

const requirePropFactory = (componentNameInError: string) => {
  const requireProp = (requiredProp: string) => (
    props: object,
    propName: string,
    componentName?: string,
    location?: string,
    propFullName?: string,
  ) => {
    const propFullNameSafe = propFullName || propName

    if (typeof (props as any)[propName] !== 'undefined' && !(props as any)[requiredProp]) {
      return new Error(
        `The property \`${propFullNameSafe}\` of ` +
          `\`${componentNameInError}\` must be used on \`${requiredProp}\`.`,
      )
    }

    return null
  }
  return requireProp
}

export default requirePropFactory
