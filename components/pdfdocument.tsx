import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { messageObject } from "@/app/api/types";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

export function PDFDocument({objectArray}:{objectArray: messageObject[]}) {
    return (
        <Document>
            <Page style={styles.page}>
                {objectArray.map((object) => {
                    return (
                        <>
                            <Text>{object.title}</Text>
                            <Text>{object.numberMessages}</Text>
                        </>

                    )
                })}
            </Page>
        </Document>
    )
}