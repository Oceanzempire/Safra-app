"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { format } from "date-fns"
import { colors } from "@/constants/colors"

const TimeWeatherHeader = () => {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = format(now, "HH:mm:ss")
      setCurrentTime(timeString)
    }

    updateTime()
    const timeInterval = setInterval(updateTime, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{currentTime}</Text>
      <Text style={styles.weather}>Weather: Sunny, 22°C</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  weather: {
    fontSize: 16,
    color: colors.textSecondary,
  },
})

export default TimeWeatherHeader
