import { BAD_SMELL_CATEGORY } from "../../common/constants"
import React from "react"
import { SVGProps } from "react"




export function BSCateIcon({
  badSmellCate,
  ...props
}:{
  badSmellCate: string;
} & SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        {...props}
      >
        <g
          fill="none"
          stroke="red"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          {badSmellCate === BAD_SMELL_CATEGORY.BS1 && (
            <>
              <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
              <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
              <path d="M14 14v-8l-2 2" />
            </>
              
          )}
         {badSmellCate === BAD_SMELL_CATEGORY.BS2 && (
            <>
                <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
                <path d="M12 8a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0" />
            </>
              
          )}
          {badSmellCate === BAD_SMELL_CATEGORY.BS3 && (
            <>
             <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
              <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
              <path d="M14 10a2 2 0 1 0 -2 -2" />
              <path d="M12 12a2 2 0 1 0 2 -2" />
            </>
              
          )}
          {badSmellCate === BAD_SMELL_CATEGORY.BS4 && (
            <>
                <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
                <path d="M15 14v-8l-4 6h5" />
            </>
              
          )}
          {badSmellCate === BAD_SMELL_CATEGORY.BS5 && (
            <>
                <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M12 14h2a2 2 0 1 0 0 -4h-2v-4h4" />
                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
            </>
              
          )}
          {badSmellCate === BAD_SMELL_CATEGORY.BS6 && (
            <>
                <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M14 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M16 8a2 2 0 1 0 -4 0v4" />
                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
            </>
              
          )}
          {badSmellCate === BAD_SMELL_CATEGORY.BS7 && (
            <>
                <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M12 6h4l-2 8" />
                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
            </>
              
          )}
          {badSmellCate === BAD_SMELL_CATEGORY.BS8 && (
            <>
                <path d="M7 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
                <path d="M14 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M14 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
            </>
              
          )}
          
        </g>
      </svg>
    )
  }
