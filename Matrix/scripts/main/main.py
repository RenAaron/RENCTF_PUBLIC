import firebase_admin
from firebase_admin import credentials, firestore
from samplebase import SampleBase
from rgbmatrix import graphics, RGBMatrix, RGBMatrixOptions
import os 
import time
from PIL import Image
from text import *

cred = credentials.Certificate('CREDS IN THE JSON FILE WITHIN THIS DIRECTORY')
app = firebase_admin.initialize_app(cred)
db = firestore.client()

doc_ref = db.collection("games").document("TIC-TAC-TOE")
state_ref = db.collection("matrix_state").document("STATE")
users_ref = db.collection("users")

options = RGBMatrixOptions()
options.rows = 64
options.cols = 64
options.chain_length = 1
options.parallel = 1
options.hardware_mapping = 'adafruit-hat'
options.drop_privileges = False


matrix = RGBMatrix(options = options)


colors = {
    "R": [graphics.Color(0, 0, 0), graphics.Color(255, 75, 0), "*"],
    "B": [graphics.Color(0, 0, 0), graphics.Color(0, 100, 255), "#"],
    "W": [graphics.Color(255, 255, 255), graphics.Color(255, 255, 255), "."],
    "P": [graphics.Color(0, 0, 0), graphics.Color(217, 0, 255), "-"]
}



def getDirs(dir):
    dir_list = os.listdir(dir)
    gifs = [f for f in dir_list if f.endswith('.gif')]
    print("Retrieved:", str(gifs))
    return [dir + f for f in gifs]  

def getGifs(dirs):
    gifs = []
    for x in dirs:
        gif = Image.open(x)
        gifs.append(gif)
        print("Added gif: " + str(gif))
    return gifs

def getCanvi(gifs):
    canvi = []
    for gif in gifs:
        canvases = []
        print("Preprocessing gif", str(gif))
        for frame_index in range(0, gif.n_frames):
            gif.seek(frame_index)
            # must copy the frame out of the gif, since thumbnail() modifies the image in-place
            frame = gif.copy()
            frame.thumbnail((matrix.width, matrix.height), Image.ANTIALIAS)
            canvas = matrix.CreateFrameCanvas()
            canvas.SetImage(frame.convert("RGB"))
            canvases.append(canvas)
        
        gif.close()

        canvi.append(canvases)

    return canvi

def playGif(canvases):

    cur_frame = 0
    while(True):
        try:
            matrix.SwapOnVSync(canvases[cur_frame], framerate_fraction=2)
            cur_frame += 1
        
        except IndexError:
            break


def showGame():
    font = graphics.Font()
    font.LoadFont("../../fonts/6x10.bdf")

    old_board = ["WWWWWWWW","WWWWWWWW","WWWWWWWW","WWWWWWWW","WWWWWWWW","WWWWWWWW","WWWWWWWW","WWWWWWWW"]
    

    while 1:
        doc = doc_ref.get()
        state = state_ref.get()
        
        if(state.exists):
            if(state.to_dict()["state"] != "game"):
                matrix.Fill(0,0,0)
                break

        if doc.exists:

            for i in range (len(old_board)):
                for j in range(len(old_board[i])):
                    placement = old_board[j][i]

                    if(old_board[j][i] != doc.to_dict()["board"][j][i]):
                        
                        if(placement in colors):
                            graphics.DrawText(matrix, font, 3+(i*8), ((j+1)*8), graphics.Color(0, 0, 0), colors[placement][2])
                            graphics.DrawText(matrix, font, 2+(i*8), ((j+1)*8), graphics.Color(0, 0, 0), colors[placement][2])
                        else:
                            graphics.DrawText(matrix, font, 3+(i*8), ((j+1)*8), graphics.Color(0, 0, 0), "?")
                            graphics.DrawText(matrix, font, 2+(i*8), ((j+1)*8), graphics.Color(0, 0, 0), "?")
            
            for i in range (len(doc.to_dict()["board"])):
                for j in range(len(doc.to_dict()["board"][i])):
                    placement = doc.to_dict()["board"][j][i]
                    
                    if(old_board[j][i] != doc.to_dict()["board"][j][i]):
                        if(placement in colors):
                            graphics.DrawText(matrix, font, 3+(i*8), ((j+1)*8), colors[placement][0], colors[placement][2])
                            graphics.DrawText(matrix, font, 2+(i*8), (j+1)*8, colors[placement][1], colors[placement][2])
                        else:
                            graphics.DrawText(matrix, font, 3+(i*8), ((j+1)*8), graphics.Color(255, 255, 255), "?")
                            graphics.DrawText(matrix, font, 2+(i*8), (j+1)*8, graphics.Color(0, 255, 0), "?")
            
        else:
            print("No such document!")
        
        time.sleep(1)
        old_board = doc.to_dict()["board"]
        printBoard(old_board)

def gifSetup():
    print("Starting program...")
    myGifsDir = "../../gifs/"
    dirs = getDirs(myGifsDir)
    print(dirs)
    gifs = getGifs(dirs)
    print(gifs)

    return getCanvi(gifs)

def showGifs(canvi):
    doBreak = False
    while 1:
        for x in canvi:
            playGif(x)
            state = state_ref.get()
            
            if(state.exists): 
                if(state.to_dict()["state"] != "gifs"):
                    matrix.Fill(0,0,0)
                    doBreak = True
                    break
        if(doBreak):
            break

def showLead():

    cnt = 0 

    old_board = ["", "", ""]

    while 1:
        users = users_ref.stream()

        state = state_ref.get()

        if(state.exists): 
                if(state.to_dict()["state"] != "lead"):
                    matrix.Fill(0,0,0)
                    doBreak = True
                    break

        leader_board = {}
        user_colors = {}

        for user in users:
            challenges = user.to_dict()['comp_chal']
            score = len(challenges['easy']) + len(challenges['medium'])*2 + len(challenges['hard']*3)
            leader_board[user.to_dict()['display_name']] = score
            user_colors[user.to_dict()['display_name']] = user.to_dict()['color']

        leader_board = dict(sorted(leader_board.items(), key=lambda item: item[1],reverse=True))

        for i in range (len(list(leader_board))):
            if(list(leader_board)[i] != old_board[i]):
                print(list(leader_board)[i], " NEQ ", old_board[i])

                matrix.Fill(0,0,0)

                font = graphics.Font()
                font.LoadFont("../../fonts/7x13.bdf")
                graphics.DrawText(matrix, font, 3, 10, graphics.Color(255, 255, 255), "TOP 5")
                
                font.LoadFont("../../fonts/6x10.bdf")
                
                
                for j in range (0, len(list(leader_board))):
                    color = user_colors[list(leader_board)[j]]

                    graphics.DrawText(matrix, font, -1, 9*j + 20 , graphics.Color(int(color[0:2], 16) ,int(color[2:4], 16) ,int(color[4:6], 16) ), ("("+str(j+1) + ")"))

                    graphics.DrawText(matrix, font, 17, 9*j + 20 , graphics.Color(255, 255, 255), list(leader_board)[j])
            
                print("Before ", old_board)
                old_board = list(leader_board)
                print("After ", old_board)

                break 

            if(i == (len(list(leader_board))-1)):
                for j in range (0, len(list(leader_board))):
                    color = user_colors[list(leader_board)[j]]

                    if(cnt%2 == 0):
                        graphics.DrawText(matrix, font, 17, 9*j + 20 , graphics.Color(0, 0, 0), list(leader_board)[j])
                        graphics.DrawText(matrix, font, 17, 9*j + 20 , graphics.Color(int(color[0:2], 16) ,int(color[2:4], 16) ,int(color[4:6], 16) ), str("0x"+color))
                        time.sleep(.2)
                    else:
                        graphics.DrawText(matrix, font, 17, 9*j + 20 , graphics.Color(0, 0, 0), str("0x"+color))
                        graphics.DrawText(matrix, font, 17, 9*j + 20 , graphics.Color(255, 255, 255), list(leader_board)[j])
                        time.sleep(.2)
                    
                    if(state.exists): 
                        if(state.to_dict()["state"] != "lead"):
                            matrix.Fill(0,0,0)
                            doBreak = True
                            break
        time.sleep(5)
        cnt += 1

        

canvi = gifSetup()

while 1:
    
    state = state_ref.get()

    if(state.exists):
        current_state =state.to_dict()["state"]

        if(current_state == "game"):
            print("Displaying game!!")
            showGame()
        elif(current_state == "gifs"):
            print("Showing gifs!!!")
            showGifs(canvi)
        elif(current_state == "lead"):
            print("Showing leaderboard!")
            showLead()
        else:
            print("Unknown state ig...")
    else:
        print("state does not exist lolll ")