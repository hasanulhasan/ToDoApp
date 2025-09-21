export type Status = 'todo' | 'in_progress' | 'done'


export interface Todo {
_id: string
title: string
description?: string
status: Status
priority?: string
tags?: string[]
dueDate?: string | null
createdAt?: string
updatedAt?: string
}