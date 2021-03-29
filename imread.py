# USAGE
# based on this code https://proglib.io/p/real-time-object-detection/
# import the necessary packages
# from imutils.video import VideoStream
# from imutils.video import FPS
import numpy as np
import imutils
# import time
import cv2

prototxt="graph.pbtxt"
model="frozen_inference_graph.pb"
min_confidence = 0.15

# initialize the list of class labels MobileNet SSD was trained to
# detect, then generate a set of bounding box colors for each class
CLASSES = ["background", "capacitor_smd","capacitor_cyl","resistor_smd","resistor_array","led_smd" ]

COLORS = [(0,0,0),(190,5,190),((255,255,250)),(255,180,135),(255,255,0),(255,0,255)]

# load our serialized model from disk
print("[INFO] loading model...")
net = cv2.dnn.readNetFromTensorflow(model, prototxt)

# fps = FPS().start()

def analyse_frame_with_nnet(frame, new_width=None):
	frame = frame.copy()  # Чтобы не переписать оригинальное изображение

	_, original_width = frame.shape[:2]
	if new_width == None:
		new_width = original_width
	if new_width != original_width:
		# Ширина кадра не соответствует запрашиваемой,
		# изменить его разрешение:
		frame = imutils.resize(frame, width=new_width)

	# grab the frame dimensions and convert it to a blob
	(h, w) = frame.shape[:2]
	blob = cv2.dnn.blobFromImage(frame, size=(new_width, new_width), swapRB=True)

	# pass the blob through the network and obtain the detections and
	# predictions
	net.setInput(blob)
	detections = net.forward()

	# loop over the detections
	for i in np.arange(0, detections.shape[2]):
		# extract the confidence (i.e., probability) associated with
		# the prediction
		# print (detections)
		confidence = detections[0, 0, i, 2]

		if confidence > min_confidence:
			# extract the index of the class label from the
			# `detections`, then compute the (x, y)-coordinates of
			# the bounding box for the object
			idx = int(detections[0, 0, i, 1])
			box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
			(startX, startY, endX, endY) = box.astype("int")

			# draw the prediction on the frame
			label = "{}: {:.2f}%".format(CLASSES[idx],
				confidence * 100)
			cv2.rectangle(frame, (startX, startY), (endX, endY),
				COLORS[idx], 2)
			y = startY - 15 if startY - 15 > 15 else startY + 15
			cv2.putText(frame, label, (startX, y+3),
				cv2.FONT_HERSHEY_SIMPLEX, 0.5, COLORS[idx], 1)

	# # update the FPS counter
	# fps.update()

	return frame



# # stop the timer and display FPS information
# fps.stop()
# print("[INFO] elapsed time: {:.2f}".format(fps.elapsed()))
# print("[INFO] approx. FPS: {:.2f}".format(fps.fps()))




# do a bit of cleanup
# cv2.destroyAllWindows()
# vs.stop()