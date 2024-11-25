

// NGL this is mostly ChatGPT, ain't nobody got time to actually think through this stuff
// (Unless you're Matt Pocock)

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[Extract<keyof ObjectType, string | number>];

