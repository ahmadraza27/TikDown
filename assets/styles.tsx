import {Platform} from 'react-native'
import React, { useState } from 'react'

// main divs

export const mian_view= Platform.OS === 'android' ?" bg-gray-100 flex w-full h-full pt-2":""

// main headings  divs

export const mian_text_view = Platform.OS === 'android' ?" flex-row w-full p-2 items-center py-1.5 ":""
export const mian_text_input_view = Platform.OS === 'android' ?" flex-row w-auto p-2 items-center bg-white mx-2 rounded-xl my-3":""

// main text
export const mian_heading = Platform.OS === 'android' ?" text-xl  text-gray-600 font-semibold ":""
export const secondaru_heading  = Platform.OS === 'android' ?" text-xl  text-gray-600  ":""

// button 
export const button_view = Platform.OS === 'android' ?" flex w-auto p-2  items-center bg-white mx-2 rounded-xl  justify-center":""
export const button = Platform.OS === 'android' ? 'justify-center items-center flex-row font-bold '  : ''