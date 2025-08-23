import { Fragment, useMemo } from 'react'
import { Link } from '@inertiajs/react'
import { Dropdown, DropdownMenuTrigger } from '@/components/ui/atoms/Dropdown'
import { Button } from '@/components/ui/atoms/Button'
import {
  BreadcrumbItem,
  BreadcrumbLink as BreadcrumbLinkPrimitive,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbRoot,
  BreadcrumbSeparator,
} from './Primitives'
import { ItemOption } from '@/components/ui/atoms/Dropdown/types'

const EMPTY_LIST = {
  first: null,
  collapsed: [] as ItemOption[],
  visible: [] as IBreadcrumbItem[],
}

function BreadcrumbLink({ label, href }: IBreadcrumbItem) {
  return (
    <BreadcrumbItem>
      {href ? (
        <BreadcrumbLinkPrimitive asChild>
          <Link href={href}>{label}</Link>
        </BreadcrumbLinkPrimitive>
      ) : (
        <BreadcrumbPage>{label}</BreadcrumbPage>
      )}
    </BreadcrumbItem>
  )
}

function CollapsedItems({ items }: { items: ItemOption[] }) {
  return (
    <BreadcrumbItem>
      <Dropdown
        trigger={
          <DropdownMenuTrigger asChild>
            <Button
              iconProps={{ name: 'ellipsis' }}
              screenReaderText='Toggle menu'
            />
          </DropdownMenuTrigger>
        }
        options={items}
      />
    </BreadcrumbItem>
  )
}

export type IBreadcrumbItem = {
  label: string
  href?: string
}

export function Breadcrumb({
  items,
  itemsToDisplay,
}: {
  items: IBreadcrumbItem[]
  itemsToDisplay?: number
}) {
  const parts = useMemo(() => {
    if (items.length <= 0) return EMPTY_LIST

    const [first, ...rest] = items
    if (rest.length <= 0) return { ...EMPTY_LIST, first }

    if (itemsToDisplay && itemsToDisplay < rest.length) {
      const collapsedItemsCount = rest.length - itemsToDisplay + 1
      const collapsed = rest.slice(0, collapsedItemsCount).map(
        (item) =>
          ({
            type: 'item',
            label: item.label,
            href: item.href,
          }) satisfies ItemOption,
      )
      const visible = rest.slice(collapsedItemsCount, rest.length - 1)
      return { first, collapsed, visible }
    }

    return { first, collapsed: [], visible: rest }
  }, [items, itemsToDisplay])

  if (!parts?.first) return null

  const moreThanOneItem = parts.visible.length > 0 || parts.collapsed.length > 0

  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbLink label={parts.first.label} href={parts.first.href} />
        {moreThanOneItem ? <BreadcrumbSeparator /> : null}
        {parts.collapsed.length > 0 ? (
          <>
            <CollapsedItems items={parts.collapsed} />
            <BreadcrumbSeparator />
          </>
        ) : null}
        {parts.visible.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbLink label={item.label} href={item.href} />
            {index < parts.visible.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
        <BreadcrumbItem></BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
