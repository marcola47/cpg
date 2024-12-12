"use client"
import { useState, useEffect, useRef } from "react";

import SimpleBar from "simplebar-react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

import { formatDateTime, formatNumberOnly } from "@/lib/input-functions";
import getFirstUppercase from "@/lib/get-first-uppercase";

import clsx from "clsx";
import s from "./style.module.scss";
import 'simplebar-react/dist/simplebar.min.css';

type Width = "xs" | "s" | "m" | "l" | "xl" | "full";

export type Label = {
  name: string, 
  value: string,
  type: "number" | "string" | "date"
  width?: Width,
}

export type Field = {
  value: string | number | Date,
  handleClick?: () => any,
  color?: Color,
  index?: number,
} 

export type Toggler = {
  name: string,
  value: string,
  field: string,
  color: string,
  active: boolean
}

export type TableProps =  {
  labels: Label[],
  tableData: Field[][],
  defaultAscending?: boolean,
  defaultSorterIndex?: number,
  height?: number,
  maxHeight?: number,
}

export default function Table(props: TableProps): JSX.Element {
  const { 
    labels, 
    tableData, 
    defaultAscending,
    defaultSorterIndex,
    height,
    maxHeight,
  } = props;
  
  const [data, setData] = useState<Field[][]>(tableData);
  const [sorter, setSorter] = useState<string>(defaultSorterIndex ? labels[defaultSorterIndex].value : labels[0].value)
  const [sorterAscending, setSorterAscending] = useState<boolean>(defaultAscending !== undefined ? defaultAscending : true)

  useEffect(() => {    
    const sorterIndex = sorter ? labels.findIndex(label => label.value === sorter) : defaultSorterIndex || 0
    const sortedData = sortData(tableData, sorterIndex);
    
    setData(sortedData);
  }, [tableData, sorter, sorterAscending])

  return (
    <div className={ s.table }>
      <SimpleBar
        className={ s.data }
        style={{ 
          height: height ? `${height}px` : "560px",
          maxHeight: maxHeight ? `${maxHeight}px` : "560px" ,
        }}
      >
        <div className={ clsx(s.labels, s.border) }>
          {
            labels.map((label, index) => (
              <Label
                key={ index }
                labelData={ label }
                lastChild={ index === labels.length - 1 }
              />
            ))
          }
        </div>

        <div className={ s.rows }>
          {
            data.map((row, index) => (
              <div 
                key={ index }
                className={ clsx(s.row, s.border) }
              >
                {
                  row.map((field, index) => (
                    <Field
                      key={ index }
                      fieldData={ field }
                      index={ index }
                      lastChild={ index === row.length - 1 }
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </SimpleBar>
    </div>
  )

  type LabelProps = {
    labelData: Label,
    lastChild: boolean,
  }

  function Label(props: LabelProps): JSX.Element {
    const { labelData, lastChild } = props;

    const width = labelData.width ? getFirstUppercase(labelData.width) : "S"
    const labelIsSort = sorter === labelData.value;

    return (
      <div 
        className={ clsx(s.label, s[`width${lastChild ? "Last" : ""}${width}`]) }
        onClick={ handleSort }
      >
        <div className={ s.name }>
          { labelData.name }
        </div>

        <div className={ s.directions }>
          <FaCaretUp className={ clsx(s.caret, s.caretUp, (labelIsSort && sorterAscending) && s.caretSelected) }/>
          <FaCaretDown className={ clsx(s.caret, s.caretDown, (labelIsSort && !sorterAscending) && s.caretSelected) }/>
        </div>
      </div>
    )

    function handleSort() {
      if (sorter === labelData.value)
        setSorterAscending(!sorterAscending)

      else {
        setSorter(labelData.value);
        setSorterAscending(true);
      }
    }
  }
  
  type FieldProps = {
    fieldData: Field,
    index: number,
    lastChild: boolean
  }

  function Field(props: FieldProps): JSX.Element {
    const { fieldData, index, lastChild } = props;
    const label = labels[index];
  
    const className = clsx(
      s.field, 
      s[`width${lastChild ? "Last" : ""}${label.width ? getFirstUppercase(label.width) : "M"}`],
      fieldData.color && s[`field${getFirstUppercase(fieldData.color)}`],
      fieldData.handleClick && s.clickable
    )

    return (
       <div 
        className={ className }
        onClick={ 
          e => {
            e.stopPropagation();

            if (fieldData.handleClick)
              fieldData.handleClick();
          } 
        }
      > { 
          label.type === "date"
          ? formatDateTime(fieldData.value.toString(), true)
          : fieldData.value.toString()  
        }
      </div>
    )
  }

  function sortData(data: Field[][], sorterIndex: number): Field[][] {
    const sortedData = [...data];
    
    if (labels[sorterIndex].type === "string") {
      sortedData.sort((a, b) => {
        if (sorterAscending)
          return a[sorterIndex].value.toString().localeCompare(b[sorterIndex].value.toString());
  
        return b[sorterIndex].value.toString().localeCompare(a[sorterIndex].value.toString());
      })  
    }

    else if (labels[sorterIndex].type === "number") {
      sortedData.sort((a, b) => {
        const valueA = parseFloat(formatNumberOnly(a[sorterIndex].value.toString()))
        const valueB = parseFloat(formatNumberOnly(b[sorterIndex].value.toString()))

        if (sorterAscending)
          return valueA - valueB;

        return valueB - valueA;
      })
    }

    else if (labels[sorterIndex].type === "date") {
      sortedData.sort((a, b) => {
        const valueA = a[sorterIndex].value !== ""
        ? new Date(a[sorterIndex].value.toString()).getTime()
        : new Date(0).getTime();
        
        const valueB = b[sorterIndex].value !== ""
        ? new Date(b[sorterIndex].value.toString()).getTime()
        : new Date(0).getTime();

        if (sorterAscending)
          return valueA - valueB;

        return valueB - valueA;
      })
    }

    return sortedData;
  }
}