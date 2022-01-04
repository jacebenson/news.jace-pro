import { useQuery } from '@apollo/client'
//import { SelectField } from '@redwoodjs/forms'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Input,
} from '@chakra-ui/react'
import { Fragment, useState } from 'react'

const ReferenceField = ({ field, register, errors }) => {
  let defaultOption = (
    <>
      {field.defaultValue && field.defaultDisplay && (
        <option value={field.defaultValue}>{field.defaultDisplay}</option>
      )}
    </>
  )
  let [filterString, setFitlerString] = useState('')
  const { loading, error, data, refetch } = useQuery(field.QUERY, {
    variables: {
      filter: filterString || '',
      //q: params.get('q'),
      //filter: props.fuzzyQuery || params.get('filter'),
      skip: /*props.skip ||*/ 0,
      take: /*props.take ||*/ 10,
      //orderBy: props.orderBy || params.get('orderBy'),
    },
  })
  let handleSearchResult = () => {
    //refetch()
  }
  //console.log(field.defaultValue, field.defaultDisplay)
  let input = (
    <>
      <Input
        name={'reference.' + field.name}
        defaultValue={filterString}
        placeholder={'type a name here to filter...'}
        onBlur={(event) => {
          setFitlerString(event.target.value)
        }}
        onChange={() => {}}
      />
    </>
  )
  if (loading) {
    return <p>Loading Lazy Data</p>
  }
  if (error) {
    console.log('error', error)
    return <p>`Error! ${error}`</p>
  }
  if (data) {
    handleSearchResult(data)
  }
  let options = data?.search?.results?.map((option) => {
    //console.log('in options', option)
    try {
      if (option[field.value] !== field.defaultValue) {
        return (
          <option key={option.id} value={option[field.value]}>
            {option[field.display]}
          </option>
        )
      }
    } catch (error) {
      console.log(error)
    }
  })
  let html = (
    <FormControl key={field.name} isInvalid={errors[field.name]}>
      <FormLabel htmlFor={field.name}>{field.prettyName}</FormLabel>
      {input}
      <Select
        defaultValue={field.defaultValue}
        id={field.name}
        name={field.name}
        {...register(field.name, {
          required: field?.required || false,
        })}
      >
        <option>Pick one</option>
        {defaultOption}
        {options}
      </Select>
      <FormErrorMessage>
        {errors[field.name] && errors[field.name].message}
      </FormErrorMessage>
    </FormControl>
  )
  return <Fragment>{html}</Fragment>
  //  return <p>{input}</p>
}

export default ReferenceField
