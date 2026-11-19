Calendar_parser = Sentence

Sentence = New_event_sentence

New_event_sentence = "ok" / Json_language / Duration_language

/*$compiler.inject.source("@/src/Std/apis/calendar/CalendarParser/syntax/Json_language.pegjs")*/

/*$compiler.inject.source("@/src/Std/apis/calendar/CalendarParser/syntax/Duration_language.pegjs")*/