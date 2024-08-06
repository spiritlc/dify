'use client'
import { Fragment, useMemo, useState } from 'react'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import { Modal as AModal, Form, Input, Select } from 'antd'
import { CheckIcon } from '@heroicons/react/20/solid'

// import Button from '@/app/components/base/button'
import { Listbox, Transition } from '@headlessui/react'
import cn from 'classnames'
import { ToastContext } from '@/app/components/base/toast'
import I18n from '@/context/i18n'
import { updateMemberRole } from '@/service/common'

import 'react-multi-email/dist/style.css'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
}

const { Option } = Select
type IEditModalProps = {
  onCancel: () => void
  onSend: () => void
  member: any
}

const EditModal = ({
  onCancel,
  onSend,
  member,
}: IEditModalProps) => {
  console.log(member, '当前用户信息')
  const [form] = Form.useForm()

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' })
        break
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' })
        break
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' })
        break
      default:
    }
  }

  const onFinish = (values: any) => {
    console.log(values)
  }

  const onReset = () => {
    form.resetFields()
  }

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' })
  }

  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)

  const { locale } = useContext(I18n)

  const InvitingRoles = useMemo(() => [
    {
      name: 'normal',
      description: t('common.members.normalTip'),
    },
    {
      name: 'admin',
      description: t('common.members.adminTip'),
    },
  ], [t])
  const [memberRole, setMemberRole] = useState(member.role)

  // useEffect(() => {
  //   const roleV = find(InvitingRoles, (item: any) => item.name === member.role) || InvitingRoles[0]
  //   console.log(roleV, '当前角色是')
  //   setRole(roleV)
  // }, [])

  const [modalVisible] = useState(true)

  // 发送邀请
  let email: string = member.email
  const changeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e.target.value)
    email = e.target.value
  }
  const handleSend = async () => {
    console.log('邀请人员角色', email)
    console.log('成功')
    try {
      const { result } = await updateMemberRole({
        url: `/workspaces/current/members/${member.id}/update-role`,
        body: { role: memberRole },
      })
      if (result === 'success') {
        onCancel()
        onSend()
      }
    }
    catch (e) {}
  }

  return (
    <div>
      <AModal title={t('common.members.editTeamMember')} open={modalVisible} onCancel={onCancel} onOk={handleSend} width="450px">
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600, paddingTop: 20 }}
        >
          <Form.Item name={t('common.members.jobNumber')} label={t('common.members.jobNumber')} initialValue={member.name}>
            <Input disabled/>
          </Form.Item>
          <Form.Item name={t('common.members.name')} label={t('common.members.name')} initialValue={member.noName}>
            <Input disabled/>
          </Form.Item>
          <Form.Item name={t('common.members.email')} label={t('common.members.email')} initialValue={member.email}>
            <Input disabled onChange={changeEmail}/>
          </Form.Item>
          <Form.Item name={t('common.members.role')} label={t('common.members.role')} >
            <Listbox value={memberRole} onChange={setMemberRole}>
              <div className="relative">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-100 outline-none border-none appearance-none text-sm text-gray-900 rounded-lg">
                  <span className="block truncate capitalize">{t(`common.members.${memberRole}`)}</span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-200"
                  leaveFrom="opacity-200"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-50 w-full py-1 my-2 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {InvitingRoles.map(role =>
                      <Listbox.Option
                        key={role.name}
                        className={({ active }) =>
                          `${active ? ' bg-gray-50 rounded-xl' : ' bg-transparent'}
                          cursor-default select-none relative py-2 px-4 mx-2 flex flex-col`
                        }
                        value={role.name}
                      >
                        {({ selected }) => (
                          <div className='flex flex-row'>
                            <span
                              className={cn(
                                'text-indigo-600 w-8',
                                'flex items-center',
                              )}
                            >
                              {role.name === memberRole && (<CheckIcon className="h-5 w-5" aria-hidden="true" />)}
                            </span>
                            <div className=' flex flex-col flex-grow'>
                              <span className={`${selected ? 'font-medium' : 'font-normal'} capitalize block truncate`}>
                                {t(`common.members.${role.name}`)}
                              </span>
                              <span className={`${selected ? 'font-medium' : 'font-normal'} capitalize block truncate`}>
                                {role.description}
                              </span>
                            </div>
                          </div>
                        )}
                      </Listbox.Option>,
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </Form.Item>

        </Form>
      </AModal>
    </div>
  )
}

export default EditModal
