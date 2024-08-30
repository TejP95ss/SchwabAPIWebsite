def info(string, end="\n"): print(f"\033[92m{'[INFO]: '}\033[00m{string}", end=end) #green info
def warning(string, end="\n"): print(f"\033[93m{'[WARN]: '}\033[00m{string}", end=end) #yellow warnings
def error(string, end="\n"): print(f"\033[91m{'[ERROR]: '}\033[00m{string}", end=end) #red error
def user(string, end="\n"): print(f"\033[94m{'[USER]: '}\033[00m{string}", end=end) #blue for user input
def user_input(string): return input(f"\033[94m{'[INPUT]: '}\033[00m{string}") #related stuff

