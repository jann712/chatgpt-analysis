import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { messageObject } from "@/app/api/types";
import {v4 as uuid} from 'uuid'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        margin: 48
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    view: {
        marginVertical: 10,
        fontSize: 12
    },
    title: {
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 20
    },
    subtitle: {
        fontWeight:  200,
        fontSize: 10,
        textAlign: 'center'
    }
});

export function PDFDocument({ objectArray }: { objectArray: messageObject[] }) {
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>Exportação de dados ChatGPT</Text>
                <Text style={styles.subtitle}>Número de conversas: {objectArray.length}</Text>
                {objectArray.map((object, index) => {
                    return (
                        <View style={styles.view}>
                            <div className="flex flex-col" key={uuid()}>
                                <Text>Título do chat: {object.title}</Text>
                                <Text>Número de perguntas: {object.numberMessages}</Text>
                                <Text>Última atualização: {object.updateTime}</Text>
                            </div>
                        </View>

                    )
                })}
            </Page>
        </Document>
    )
}