import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    width?: number;
    height?: number;
  }
  


export const Google: React.FC<IconProps> = ({
  size = 24,
  width,
  height,
  ...props
}) => (
  <svg
    fill="currentColor"
    width={width || size}
    height={height || size}
    viewBox="-2 -2 24 24"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin"
    {...props}
  >
    <path d="M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z" />
  </svg>
);


export const Microsoft: React.FC<IconProps> = ({
    size = 24,
    width,
    height,
    ...props
  }) => (
    <svg
    fill="currentColor"
    width={width || size}
    height={height || size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="m0 0v10.719h10.719v-10.719zm13.279 0v10.719h10.719v-10.719zm-13.279 13.281v10.719h10.719v-10.719zm13.279 0v10.719h10.719v-10.719z" />
  </svg>
  );

export const Gitlab: React.FC<IconProps> = ({
    size = 24,
    width,
    height,
    ...props
  }) => (
    <svg
    width={width || size}
    height={height || size}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.97436 0.341889C2.90406 0.130995 2.70297 -0.00815973 2.48083 0.000371457C2.25869 0.00890261 2.06886 0.163071 2.01495 0.378735L0.0149454 8.37874C-0.0309875 8.56247 0.0308284 8.75638 0.174621 8.87963L7.17462 14.8796C7.36187 15.0401 7.63817 15.0401 7.82541 14.8796L14.8254 8.87963C14.9692 8.75638 15.031 8.56247 14.9851 8.37874L12.9851 0.378735C12.9312 0.163071 12.7413 0.00890261 12.5192 0.000371457C12.2971 -0.00815973 12.096 0.130995 12.0257 0.341889L10.1396 6H4.8604L2.97436 0.341889Z"
      fill="currentColor"
    />
  </svg>
  );

  export const Github: React.FC<IconProps> = ({
    size = 24,
    width,
    height,
    ...props
  }) => (
    <svg
      width={width || size}
      height={height || size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.976 0A7.977 7.977 0 000 7.976c0 3.522 2.3 6.507 5.431 7.584.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076-.343-.93-.881-1.175-.881-1.175-.734-.489.048-.489.048-.489.783.049 1.224.832 1.224.832.734 1.223 1.859.88 2.3.685.048-.538.293-.88.489-1.076-1.762-.196-3.621-.881-3.621-3.964 0-.88.293-1.566.832-2.153-.05-.147-.343-.978.098-2.055 0 0 .685-.196 2.201.832.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832.44 1.077.146 1.908.097 2.104a3.16 3.16 0 01.832 2.153c0 3.083-1.86 3.719-3.62 3.915.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.984 7.984 0 0016 7.976C15.951 3.572 12.38 0 7.976 0z"
      />
    </svg>
  );
  