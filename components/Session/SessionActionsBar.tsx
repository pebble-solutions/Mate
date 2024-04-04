import {Alert, AlertButton, StyleSheet, View} from "react-native";
import Button from "../Button";
import {globalStyles, variables} from "../../shared/globalStyles";
import {Ionicons} from "@expo/vector-icons";
import SwiperToggle from "../SwiperToggle";
import {useRef, useState} from "react";
import {SequenceType} from "../../shared/types/SequenceType";

type ActionsBarOptions = {
    onStart?: () => void,
    onEnd?: () => void,
    onCancel?: () => void,
    onValidate?: () => void,
    onExit?: () => void,
    started?: boolean,
    style?: object[],
    sequence: SequenceType,
}

export function SessionActionsBar({onStart, onEnd, onCancel, onValidate, onExit, started, style, sequence}: ActionsBarOptions) {

    style = style || []
    const [isStarted, setStarted] = useState(typeof started !== "undefined" ? started : false)
    const hasCloseButton = useRef(!!(onExit || onCancel))

    const toggleStatus = (newVal: boolean) => {
        setStarted(newVal)
        if (newVal && onStart) onStart()
        if (!newVal && onEnd) onEnd()
    }

    const quit = () => {

        if (!onCancel && !onExit) return null

        if (onCancel && !onExit) {
            onCancel()
            return null
        }
        if (onExit && !onCancel) {
            onExit()
            return null
        }

        const buttons: AlertButton[] = []

        if (onCancel) {
            buttons.push({
                text: "Supprimer",
                onPress: () => onCancel(),
                style: "cancel"
            })
        }

        if (onExit) {
            buttons.push({
                text: "Reprendre plus tard",
                onPress: () => onExit()
            })
        }

        Alert.alert(
            "Quitter la session",
            "Souhaitez-vous annuler cette session ou reprendre plus tard ?",
            buttons)
    }

    return (
        <View style={[localStyle.actionsContainer, ...style]}>
            <View style={[localStyle.buttonContainer, localStyle.startContainer]}>
                {!isStarted && hasCloseButton ? <Button
                    title="Fermer"
                    onPress={quit}
                    style={[globalStyles.transparentBg]}
                    titleStyle={[globalStyles.textDanger]}
                    icon={<View style={globalStyles.meContainer}><Ionicons name="close-outline" size={24} color={variables.color.danger} /></View>}
                /> : null}
            </View>

            <View style={[localStyle.swiperContainer]}>
                <SwiperToggle
                    height={180}
                    sizeInterpolation={1.8}
                    initialValue={isStarted}
                    onToggle={toggleStatus}
                    onLabel="Démarré"
                    offLabel="Pause"
                />
            </View>

            <View style={[localStyle.buttonContainer, localStyle.endContainer]}>
                {!isStarted && sequence.length ? <Button
                    title="Valider"
                    onPress={() => {
                        if (onValidate) onValidate()
                    }}
                    style={[globalStyles.transparentBg]}
                    titleStyle={[globalStyles.textSuccess]}
                    icon={<View style={globalStyles.meContainer}><Ionicons name="checkmark" size={24} color={variables.color.success} /></View>}
                /> : null}
            </View>
        </View>
    )
}

const localStyle = StyleSheet.create({
    actionsContainer: {
        flexDirection: "row",
        alignItems: "flex-end"
    },

    swiperContainer: {
        flex:1,
        alignItems: "center"
    },

    buttonContainer: {
        flexDirection: "row",
        flex:1,
        alignItems: "center"
    },

    startContainer: {
        justifyContent: "flex-start"
    },

    endContainer: {
        justifyContent: "flex-end"
    },
})