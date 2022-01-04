import {
  Input,
  Alert,
  AlertIcon,
  //  AlertTitle,
  //  AlertDescription,
  Box,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  //  FormHelperText,
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'
//import { Link, useLocation } from '@redwoodjs/router'
//import { useAuth } from '@redwoodjs/auth'
//import ReferenceField from 'src/components/ReferenceField'
import { Fragment } from 'react'
import ReferenceField from '../ReferenceField/ReferenceField'
const FormComponent = ({
  record,
  fields,
  //roles,
  onSubmit,
  //onDelete,
  //loading,
  error,
  //returnLink,
}) => {
  function PasswordInput({ field }) {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
      <FormControl key={field.name} isInvalid={errors[field.name]}>
        <FormLabel htmlFor={field.name}>{field.prettyName}</FormLabel>
        <InputGroup size="md">
          <Input
            id={field.name}
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            placeholder={field.placeholder || 'Enter password'}
            {...register(field.name, {
              //            required: field?.required || false,
              //            minLength: field.minLength,
            })}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>

        <FormErrorMessage>
          {errors[field.name] && errors[field.name].message}
        </FormErrorMessage>
      </FormControl>
    )
  }
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()
  let fieldsHtml = fields.map((field) => {
    //console.log(field, field.name, 'type', field.type)
    let html = (
      <FormControl key={field.name} isInvalid={errors[field.name]}>
        <FormLabel htmlFor={field.name}>{field.prettyName}</FormLabel>
        <Input
          id={field.name}
          placeholder={field.placeholder || ''}
          {...register(field.name, {
            required: field?.required || false,
            minLength: field.minLength,
          })}
          defaultValue={record?.[field.name]}
        />
        <FormErrorMessage>
          {errors[field.name] && errors[field.name].message}
        </FormErrorMessage>
      </FormControl>
    )
    if (field.type === 'password') {
      //console.log('field is password')
      html = <PasswordInput key={field.name} field={field} />
    }
    if (field.type === 'reference') {
      html = (
        <ReferenceField
          key={field.name}
          field={field}
          register={register}
          errors={errors}
        />
      )
    }
    return html
  })
  return (
    <Fragment>
      <Box bg={'white'} p={3}>
        {error?.graphQLErrors[0]?.message && (
          <Alert status="error">
            <AlertIcon />
            {error?.graphQLErrors[0]?.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {fieldsHtml}
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Box>
    </Fragment>
  )
}

export default FormComponent
